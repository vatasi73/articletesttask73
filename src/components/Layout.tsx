import { Link, Outlet } from "react-router-dom";
import { useAppDispatch } from "../store";
import { logout } from "../slices/authSlice";

const Layout = () => {
  const dispatch = useAppDispatch();

  const handleLogOut = () => {
    dispatch(logout());
  };
  return (
    <>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "20px",
          width: "100%",
        }}
      >
        <Link to="/">ArticleDash</Link>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="changePassword">ChangePassword</Link>
          <button onClick={handleLogOut}>Logout</button>
        </div>
      </header>
      <main style={{ display: "flex", gap: "100px" }}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
