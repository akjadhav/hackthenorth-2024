import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

function UserList() {
  const users = useQuery(api.yourFileName.getUsers);

  if (users === undefined) {
    return <div>Loading...</div>;
  }

  return (
    // <ul>
    //   {users.map((user) => (
    //     <li key={user._id}>{user.name}</li>
    //   ))}
    // </ul>
  );
}