export default function LoginButtons({ user }) {
  return (
    <button className="border border-accent px-3  rounded-md text-accent bg-accent bg-opacity-20 hover:bg-opacity-30">
      {user ? (
        <a href="/api/auth/logout">Logout</a>
      ) : (
        <a href="/api/auth/login">Login</a>
      )}
    </button>
  );
}
