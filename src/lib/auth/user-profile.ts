import type { User } from "@clerk/nextjs/server";
import { getPrisma } from "@/lib/db/prisma";

export async function upsertUserProfile(user: User) {
  const primaryEmail =
    user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    throw new Error("Authenticated user does not have an email address.");
  }

  return getPrisma().userProfile.upsert({
    where: { clerkId: user.id },
    create: {
      clerkId: user.id,
      email: primaryEmail,
      name: user.fullName,
    },
    update: {
      email: primaryEmail,
      name: user.fullName,
    },
  });
}

