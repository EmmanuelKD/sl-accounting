"use server";
import { signIn, signOut } from "@/auth";
import UserManagementModule from "@/module/UserManagementModule";
import { switchPath } from "@/utils/routing";
import { User } from "@prisma/client";

export async function authenticate({
  email,
  password,
}: {
  email: string;
  password: string;
  origin: string;
}) {
  // try {
  const um = new UserManagementModule();
  const res = await um.loginUser(email as string, password as string);

  const _callback = switchPath(res.data.user.role, "");

  return await signIn("credentials", {
    redirect: false,
    redirectTo: _callback,
    user: JSON.stringify(res.data.user),
    accessToken: res.data.token,
  });
  // } catch (e) {
  //   console.log(e);
  //   if (e instanceof HttpError) return JSON.parse(JSON.stringify(e.toJSON()));
  // }
  // return null;
}

export async function createUser(
  user: Omit<
    User,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "business"
    | "businessId"
    | "notifications"
    | "otp"
    | "isVerified"
  >,
  workspace: string[],
  origin: string
) {
  const um = new UserManagementModule();
  // let bm = new BusinessModule();
  // added name to user module

  const res = await um.registerUser(
    {
      email: user.email,
      password: user.password,
      role: user.role,
      imgUrl: user.imgUrl,
      name: user.name,
    },
    workspace
  );
  if (res.code === 201) {
    const _callback = switchPath(res.user.role, origin);

    return await signIn("credentials", {
      redirect: true,
      redirectTo: _callback,
      accessToken: res.user.token,
      user: JSON.stringify(res.user),
    });
  }
}

export async function updateUsersProfilePhoto(
  uid: string,
  imgUrl: string
): Promise<{
  code: number;
  success: boolean;
  message: string;
  data: User;
}> {
  const um = new UserManagementModule();
  return um.updateUserPhoto(uid, imgUrl);
}

export async function updateUsersProfile(
  uid: string,
  name?: string,
  phone?: string,
  email?: string
): Promise<{
  code: number;
  success: boolean;
  message: string;
  data: User;
}> {
  const um = new UserManagementModule();
  return um.updateUser(uid, name, email, phone);
}

export async function updateUsersPassword(
  uid: string,
  password: string
): Promise<{
  code: number;
  success: boolean;
  message: string;
  data: User;
}> {
  const um = new UserManagementModule();
  return um.updateUserPassword(uid, password);
}

export async function logout() {
  try {
   await signOut();
  } catch (e) {
    alert(`${JSON.stringify(e)}`);
  }
}
