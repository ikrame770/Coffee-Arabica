import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { mockFetch, sentBodies } from "../testUtils";
import Users from "./Users";

const USERS = [
  { id: 1, firstName: "Sara", lastName: "Alami", username: "sara",
    email: "sara@mail.com", phone: "0600", role: "ADMIN", active: true },
  { id: 2, firstName: "Omar", lastName: "Benni", username: "omar",
    email: "omar@mail.com", phone: "", role: "BARISTA", active: false },
];

beforeEach(() => {
  sessionStorage.clear();
  jest.spyOn(window, "confirm").mockReturnValue(true);
});
afterEach(() => jest.restoreAllMocks());

test("affiche la liste des utilisateurs avec leur statut", async () => {
  mockFetch({ "/users": USERS });
  render(<Users />);

  expect(await screen.findByText("Sara Alami")).toBeInTheDocument();
  expect(screen.getByText("omar")).toBeInTheDocument();
  expect(screen.getByText("✅ Actif")).toBeInTheDocument();
  expect(screen.getByText("❌ Désactivé")).toBeInTheDocument();
});

test("affiche l'état vide quand il n'y a aucun utilisateur", async () => {
  mockFetch({ "/users": [] });
  render(<Users />);

  expect(await screen.findByText("Aucun utilisateur")).toBeInTheDocument();
});

test("crée un utilisateur depuis la modale", async () => {
  const fetchMock = mockFetch({ "/users": USERS, "POST /users": { id: 3 } });
  render(<Users />);
  await screen.findByText("Sara Alami");

  userEvent.click(screen.getByRole("button", { name: /Nouvel utilisateur/ }));
  userEvent.type(screen.getByLabelText(/^Prénom/), "Lina");
  userEvent.type(screen.getByLabelText(/^Nom \*/), "Haddad");
  userEvent.type(screen.getByLabelText(/^Nom d'utilisateur/), "lina");
  userEvent.type(screen.getByLabelText(/^Email/), "lina@mail.com");
  userEvent.type(screen.getByLabelText(/^Mot de passe/), "secret123");
  userEvent.click(screen.getByRole("button", { name: /Créer/ }));

  await waitFor(() =>
    expect(sentBodies(fetchMock, "POST", "/users")).toHaveLength(1));
  expect(sentBodies(fetchMock, "POST", "/users")[0]).toMatchObject({
    firstName: "Lina", lastName: "Haddad", username: "lina",
    email: "lina@mail.com", password: "secret123", role: "BARISTA",
  });
});

test("modifier pré-remplit le formulaire, mot de passe vide", async () => {
  mockFetch({ "/users": USERS });
  render(<Users />);
  await screen.findByText("Sara Alami");

  userEvent.click(screen.getAllByRole("button", { name: /Modifier/ })[0]);

  expect(screen.getByLabelText(/^Prénom/)).toHaveValue("Sara");
  expect(screen.getByLabelText(/^Nom d'utilisateur/)).toHaveValue("sara");
  expect(screen.getByLabelText(/^Mot de passe/)).toHaveValue("");
  expect(screen.getByRole("button", { name: /Enregistrer/ })).toBeInTheDocument();
});

test("la mise à jour sans mot de passe n'envoie pas le champ password", async () => {
  const fetchMock = mockFetch({ "/users": USERS, "PUT /users/1": { id: 1 } });
  render(<Users />);
  await screen.findByText("Sara Alami");

  userEvent.click(screen.getAllByRole("button", { name: /Modifier/ })[0]);
  userEvent.click(screen.getByRole("button", { name: /Enregistrer/ }));

  await waitFor(() =>
    expect(sentBodies(fetchMock, "PUT", "/users/1")).toHaveLength(1));
  const body = sentBodies(fetchMock, "PUT", "/users/1")[0];
  expect(body).not.toHaveProperty("password");
  expect(body.username).toBe("sara");
});

test("la mise à jour avec un mot de passe l'envoie", async () => {
  const fetchMock = mockFetch({ "/users": USERS, "PUT /users/1": { id: 1 } });
  render(<Users />);
  await screen.findByText("Sara Alami");

  userEvent.click(screen.getAllByRole("button", { name: /Modifier/ })[0]);
  userEvent.type(screen.getByLabelText(/^Mot de passe/), "nouveau123");
  userEvent.click(screen.getByRole("button", { name: /Enregistrer/ }));

  await waitFor(() =>
    expect(sentBodies(fetchMock, "PUT", "/users/1")).toHaveLength(1));
  expect(sentBodies(fetchMock, "PUT", "/users/1")[0].password).toBe("nouveau123");
});

test("désactive un utilisateur actif via PATCH", async () => {
  const fetchMock = mockFetch({
    "/users": USERS,
    "PATCH /users/1/status": { id: 1 },
  });
  render(<Users />);
  await screen.findByText("Sara Alami");

  userEvent.click(screen.getByRole("button", { name: /Désactiver/ }));

  await waitFor(() =>
    expect(sentBodies(fetchMock, "PATCH", "/users/1/status")).toHaveLength(1));
  expect(sentBodies(fetchMock, "PATCH", "/users/1/status")[0]).toEqual({
    active: false,
  });
});

test("un admin ne peut pas désactiver son propre compte", async () => {
  sessionStorage.setItem(
    "auth",
    JSON.stringify({ token: "x", username: "sara", role: "ADMIN" }),
  );
  mockFetch({ "/users": USERS });
  render(<Users />);
  await screen.findByText("Sara Alami");

  expect(screen.getByRole("button", { name: /Désactiver/ })).toBeDisabled();
});

test("affiche une erreur si le chargement échoue", async () => {
  mockFetch({ "/users": { ok: false } });
  render(<Users />);

  expect(await screen.findByRole("alert")).toBeInTheDocument();
});