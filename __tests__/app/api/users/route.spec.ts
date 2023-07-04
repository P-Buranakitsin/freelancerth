import { getServerSession } from 'next-auth';
import { createMocks } from 'node-mocks-http';
import { GET, IResponseGETProfileAPI, PATCH } from "@/app/api/profiles/route";
import "@testing-library/jest-dom";
import { expect } from '@jest/globals';
import { useSession } from "next-auth/react";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { utapi } from "uploadthing/server";
import { PrismaClient } from '@prisma/client';

// jest.mock("next-auth/react", () => {
//   const originalModule = jest.requireActual("next-auth/react");
//   const mockSession = {
//     expires: new Date(Date.now() + 2 * 86400).toISOString(),
//     user: { username: "admin" },
//   };
//   return {
//     __esModule: true,
//     ...originalModule,
//     useSession: jest.fn(() => {
//       return { data: mockSession, status: "authenticated" }; // return type is [] in v3 but changed to {} in v4
//     }),
//   };
// });

jest.mock('next-auth/react', () => ({
  ...(jest.requireActual('next-auth/react') as object),
  useSession: jest.fn(),
}));

jest.mock('next-auth', () => ({
  ...(jest.requireActual('next-auth') as object),
  getServerSession: jest.fn(),
}))

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    // Add mock implementations for the methods you need to mock here
    // For example:
    user: {
      findMany: jest.fn(),
    },
  })),
}));

// jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
//   authOptions: {
//     // mock values for authOptions go here
//   },
// }));

jest.mock("uploadthing/server", () => ({
  utapi: jest.fn(() => {})
}))


jest.mock('@/lib/prisma', () => ({
  prisma: {
    profile: {
      findMany: jest.fn(() => {
        return {
          sds: 'df'
        }
      }),
    },
  },
}));

describe("PATCH method", () => {
  it("should return unauthorized access if session is not present", async () => {
    const { req, res } = createMocks({
      method: 'GET',
      url: 'http://localhost:3000/api/profiles?userId=clj2y8ugt0000uj941uu145hk',
      headers: {
        "Content-Type": "application/json",
      },
    });
    (getServerSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          username: "jeffrafter",
          sub: 'clj2y8ugt0000uj941uu145hk',

        },
      },
      status: "authenticated",
    })

    const aa = await GET(req, res)
    console.log(await aa.json())

    // const res = await fetch(`http://localhost:3000/api/users`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // const users = (await res.json()) as IResponseGETProfileAPI;
    // console.log(users)
    // expect(users).toEqual({ message: 'unauthorized access', data: null })

    // const res = await fetch(`/api/users`, {
    //   method: "PATCH",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    // console.log(res)
  });

  it('Eew', async () => {
    (useSession as jest.Mock).mockReturnValue({
      data: {
        user: {
          username: "jeffrafter",
        },
      },
      status: "authenticated",
    })
  })

  it('does something', () => {
    const prisma = new PrismaClient();

    // Add your test code here
  });

  // it("ewe", async () => {
  //   const { data: session } = useSession();
  //   const res = await fetch(`http://localhost:3000/api/profiles?userId=clj2y8ugt0000uj941uu145hk`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "Cookie": "next-auth.csrf-token=b73cf6164b7e440862a12d10c34014a6889d8c940a8290b160426c400c8949aa%7C4297d00aa33eb8d7868d53c0501b36d2b2ee41bc101fd34beb8eceaaead8da09; next-auth.callback-url=http%3A%2F%2Flocalhost%3A3000; next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..QcPbaub_sG-HPiM0.OIBrlNBeXUfaEVB9vH6mvW8kXXNssAOgTn7MBQbwVaVDc_uxaxTdjtOu15hh1IyhsiIt52_K_u1GAA5imT8p8y9wQmWvXg4_yjGrAs-QnrdP-KOU4o3L7oFR5VKQJetfp9FWx9-_nqgCY0IWEmMGyaWyW-Or7zE_zRw3QHzLrpFVtBOf_cTlOm6C6EFzAVOG5SOTsHq2LNa9l20x8XNyjB3zeBGD5zMseWSQdqsAo9RI4dS2ye5tsl5sbTF5JvGT2z8V4HC8L3CoiJlMYr7cpcaaDyF7Cx8lMotIVY8_3-_s3S0ihEwW4JkJymG-tFqzSTIm-Fq_QExxyjRPASNsAnRs3ZDxD0mzfLbGIJ9cr5CENAlMjOFpKYQbRl8pZZNnOE_AeZ21fI8eHli7rawslqShjNztZ1Y_2Sqm-1MUVHai7TmhXd-RZEqQEG5x_6-IaJgn6S5XPz6OmKM.I0pthpx9ow1tC-V_EsT-dA"
  //     },
  //   });
  //   const users = (await res.json()) as IResponseGETProfileAPI;
  //   console.log(users.data?.profiles)
  // })
});
