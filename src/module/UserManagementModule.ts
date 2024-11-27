"use server";
import { User, UserRole, Workspace } from "@prisma/client";
import bcrypt from "bcrypt-edge";
import jwt from "jsonwebtoken";
// import otpGenerator from "otp-generator";
import { prisma } from "@/db";
import {
  // sendOTPEmail,
  sendResetPasswordEmail,
} from "@/utils/email";
import { HttpError } from "@/utils/errorHandler";

type UserDTO = Omit<User, "createdAt" | "updatedAt">;
export const registerUser = async (user: UserDTO, workspaces: Workspace[]) => {
  const userEmail = user.email;

  // Create user in the database
  const UserCount = await prisma.user.count();
  const existingUser = await prisma.user.findFirst({
    where: { email: userEmail },
  });

  if (existingUser) {
    throw new HttpError({
      code: 403,
      success: false,
      message: "User With This Email Already Exists",
    });
  }

  // const otp = otpGenerator.generate(6, {
  //   upperCaseAlphabets: false,
  //   specialChars: false,
  //   lowerCaseAlphabets: false,
  //   digits: true,
  // });
  // save hash password
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(user.password, salt);
  // Create user with the generated OTP
  const createdUser = await prisma.user.create({
    include: { workspaces: true },

    data: {
      email: user.email,
      imgUrl: user.imgUrl,
      name: user.name,
      password: hash,
      role: Boolean(UserCount) ? user.role : "ADMIN",
      workspaces: {
        connect: workspaces.map((workspace) => ({ id: workspace.id })),
      },
    },
  });

  // Generate JWT token
  const token = jwt.sign(
    {
      _id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      workspace: createdUser.workspaces,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
  // Path to the HTML file
  // await sendOTPEmail(otp, createdUser.email);

  return {
    code: 201,
    success: true,
    message: "Created User Successfully",
    user: {
      id: createdUser.id,
      email: createdUser.email,
      role: createdUser.role,
      name: createdUser.name,
      imgUrl: createdUser.imgUrl,
      token,
    },
  };
};
export const deleteUser = async (id: string) => {
  await prisma.user.delete({
    where: { id },
  });
};
export const getUsers = async () => {
  return await prisma.user.findMany({
    include: {
      workspaces: true,
    },
  });
};
export const updateUserPassword = async (uid: string, password: string) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const updatedUser = await prisma.user.update({
      where: { id: uid },
      data: { password: hash },
    });

    return {
      code: 201,
      success: true,
      message: "Users Password Updated Successfully",
      data: updatedUser,
    };
  } catch (error) {
    throw new HttpError({ code: 400, success: false, error: error });
  }
};
export const updateUserPhoto = async (uid: string, imgUrl: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: uid },
      data: { imgUrl },
    });

    if (!updatedUser) {
      throw new HttpError({
        code: 404,
        success: false,
        message: "User Not Found",
      });
    }

    return {
      code: 201,
      success: true,
      message: "Users Photo Updated Successfully",
      data: updatedUser,
    };
  } catch (error) {
    throw new HttpError({ code: 400, success: false, error: error });
  }
};
export const updateUser = async (
  uid: string,
  name?: string,
  email?: string,
  role?: UserRole,
  workspaces?: Workspace[]
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: uid },
      data: {
        ...(name && { name }),
        ...(role && { role }),
        ...(Boolean(email) && { email }),
        ...(workspaces && {
          workspaces: {
            connect: workspaces.map((workspace) => ({ id: workspace.id })),
          },
        }),
      },
    });

    if (!updatedUser) {
      throw new HttpError({
        code: 404,
        success: false,
        message: "User Not Found",
      });
    }

    return {
      code: 201,
      success: true,
      message: "Login Successfully",
      data: updatedUser,
    };
  } catch (error) {
    throw new HttpError({ code: 400, success: false, error: error });
  }
};
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findFirst({
    include: { workspaces: true },
    where: { email },
  });

  if (!user) {
    throw new HttpError({
      code: 404,
      success: false,
      message: "The user with this email not found",
    });
  }

  if (!user.password) {
    throw new HttpError({
      code: 404,
      success: false,
      message: "The user with this email not found",
    });
  }

  const isPasswordMatch = bcrypt.compareSync(password, user.password);

  if (!isPasswordMatch) {
    throw new HttpError({
      code: 404,
      success: false,
      message: "Users Credentials Are Incorrect",
    });
  }

  const token = jwt.sign(
    {
      _id: user.id,
      email: user.email,
      role: user.role,
      workspace: user.workspaces,
    },

    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );

  return {
    code: 200,
    success: true,
    message: "Login Successfully",
    data: { token, user },
  };
};
export const forgetPassword = async (email: string, origin: string) => {
  try {
    //   const request = await req.body;
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw { code: 404, success: false, message: "User Not Found " };
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "7d",
    });
    // Constructing the link with the token
    const resetPasswordLink = `${origin}/auth/reset-password/${token}`;
    await sendResetPasswordEmail(resetPasswordLink, email);

    return {
      code: 200,
      success: true,
      message: "Forgot Password Email Sent Successfully.",
      token,
    };
  } catch (error) {
    throw new HttpError({ code: 500, success: false, error: error });
  }
};
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    // Verify the token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
        id: string;
      };
    } catch (error) {
      throw new HttpError({
        code: 500,
        success: false,
        error: error,
        message: "Invalid Or Expired Token. Please Request A New One.",
      });
    }

    // Find the user by ID from the token
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw {
        code: 404,
        success: false,
        message: "User Not Found ",
      };
    }
    if (!newPassword || !user.password) {
      throw {
        code: 400,
        success: false,
        message:
          "Invalid Data. Both NewPassword And User Password Are Required.",
      };
    }

    // Check if the new password is the same as the old password
    const isSamePassword = bcrypt.compareSync(newPassword, user.password);
    if (isSamePassword) {
      throw {
        code: 400,
        success: false,
        message: "New Password Must Be Different From The Old Password.",
      };
    }
    // Update the user's password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(user.password, salt);
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
      },
    });

    return {
      code: 200,
      success: true,
      message: "Password Updated Successfully.",
      user,
    };
  } catch (error) {
    throw new HttpError({ code: 500, success: false, error: error });
  }
};

// verifyOtp = async (email: string, otp: string) => {
//   try {
//     // Find the user with the provided email
//     const user = await prisma.user.findFirst({ where: { email } });

//     if (!user) {
//       throw { code: 404, success: false, message: "User Not Found" };
//     }

//     // Check if the OTP is already verified
//     if (user.isVerified) {
//       throw {
//         code: 400,
//         success: false,
//         message: "OTP Has Already Been Verified",
//       };
//     }

//     // Verify the OTP using an if-else statement
//     let message = "";
//     if (otp === user.otp) {
//       // Update the user's status to verified
//       await prisma.user.update({
//         where: { email },
//         data: { isVerified: true },
//       });
//       message = "OTP Verified Successfully";
//       return { code: 201, success: true, message };
//     } else {
//       message = "Invalid OTP";
//       throw { code: 404, success: false, message };
//     }
//   } catch (error) {
//     // @ts-ignore
//     throw { code: 400, success: false, message: error.message };
//   }
// };

// resendOtp = async (email: string) => {
//   try {
//     // Find the user with the provided email
//     const user = await prisma.user.findFirst({ where: { email } });

//     if (!user) {
//       throw { code: 404, success: false, message: "User Not Found" };
//     }

//     if (user.isVerified) {
//       throw {
//         code: 400,
//         success: false,
//         message: "OTP Has Already Been Verified",
//       };
//     }
//     // Generate new OTP
//     const otp = otpGenerator.generate(6, {
//       upperCaseAlphabets: false,
//       specialChars: false,
//       lowerCaseAlphabets: false,
//       digits: true,
//     });
//     // Update the user's OTP
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         otp: otp.toString(),
//       },
//     });

//     await sendOTPEmail(otp, user.email ?? email);
//     // Return the response
//     return {
//       code: 200,
//       success: true,
//       message: "OTP Resent Successfully",
//     };
//   } catch (error) {
//     // @ts-ignore
//     throw { code: 400, success: false, message: error.message };
//   }
// };
