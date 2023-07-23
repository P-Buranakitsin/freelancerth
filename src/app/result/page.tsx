import DialogBox from "@/components/DialogBox";
import { endpoints } from "@/constants/endpoints";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";

export default async function Result() {
  const session = await getServerSession(authOptions);

  return (
    <DialogBox
      description={"Thank you for using our website"}
      linkMessage="Check my order history"
      title={"Payment Complete"}
      url={endpoints.PAGE.orderHistory(session?.user.sub || "")}
    />
  );
}
