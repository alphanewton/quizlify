import { User } from "next-auth";
import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import Image from "next/image";

function UserAvatar({ user }: { user: Pick<User, "name" | "image"> }) {
  return (
    <Avatar>
      {user.image ? (
        <div className="relative w-full h-full aspect-square">
          <Image fill src={user.image} alt="PP" referrerPolicy="no-referrer" />
        </div>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.name}</span>
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;
