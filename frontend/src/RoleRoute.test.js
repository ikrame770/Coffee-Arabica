import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import RoleRoute from "./RoleRoute";

const setAuth = (role) =>
  sessionStorage.setItem("auth", JSON.stringify({ token: "x", role }));

const renderAt = (path = "/admin/users") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<p>Page login</p>} />
        <Route path="/admin" element={<p>Page admin</p>} />
        <Route
          path="/admin/users"
          element={
            <RoleRoute roles={["ADMIN"]}>
              <p>Page utilisateurs</p>
            </RoleRoute>
          }
        />
      </Routes>
    </MemoryRouter>,
  );

beforeEach(() => sessionStorage.clear());

test("un visiteur est redirigé vers /login", () => {
  renderAt();
  expect(screen.getByText("Page login")).toBeInTheDocument();
});

test("un BARISTA est redirigé vers /admin", () => {
  setAuth("BARISTA");
  renderAt();
  expect(screen.getByText("Page admin")).toBeInTheDocument();
});

test("un ADMIN accède à la page", () => {
  setAuth("ADMIN");
  renderAt();
  expect(screen.getByText("Page utilisateurs")).toBeInTheDocument();
});