import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { mockFetch } from "../testUtils";
import Login from "./Login";

const setIsAdmin = jest.fn();

const renderLogin = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <Routes>
        <Route path="/login" element={<Login setIsAdmin={setIsAdmin} />} />
        <Route path="/admin" element={<p>Page admin</p>} />
      </Routes>
    </MemoryRouter>,
  );

const fillAndSubmit = () => {
  userEvent.type(
    screen.getByPlaceholderText("Entrez votre nom d'utilisateur"), "sara");
  userEvent.type(
    screen.getByPlaceholderText("Entrez votre mot de passe"), "pwd");
  userEvent.click(screen.getByRole("button", { name: /Se connecter/ }));
};

beforeEach(() => {
  sessionStorage.clear();
  //localStorage.clear();
  setIsAdmin.mockClear();
});

test("connexion réussie : stocke le rôle et redirige vers /admin", async () => {
  mockFetch({
    "/auth/me": { username: "sara", firstName: "Sara", role: "ADMIN" },
  });
  renderLogin();
  fillAndSubmit();

  expect(await screen.findByText("Page admin")).toBeInTheDocument();
  expect(JSON.parse(sessionStorage.getItem("auth")).role).toBe("ADMIN");
  expect(setIsAdmin).toHaveBeenCalledWith(true);
});

test("identifiants incorrects : affiche une erreur", async () => {
  mockFetch({ "/auth/me": { ok: false } });
  renderLogin();
  fillAndSubmit();

  expect(await screen.findByRole("alert")).toHaveTextContent(
    "Identifiants incorrects",
  );
  await waitFor(() => expect(sessionStorage.getItem("auth")).toBeNull());
});