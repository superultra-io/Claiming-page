import React from "react";
import { useWeb3React } from "@web3-react/core";
import { claimToken } from "../../../utils/contractCall";
import { putRequestCall } from "../../../utils/backendCall";
import { Button } from "antd";

const styles = {
  container: {
    width: "90%",
    border: "solid #75e287 1px",
    borderRadius: "20px",
    margin: "20px auto",
    padding: "30px 0",
    boxShadow: "rgba(0, 0, 0, 0.35) 0px 3px 10px"
  }
} as const;

export const ClaimToken: React.FC<any> = () => {
  const { account, provider } = useWeb3React();
  const signer = provider?.getSigner();

  const handleClick = async () => {
    if (account) {
      const response = await putRequestCall(account);
      console.log(response);

      const tx = await claimToken(response.data, signer);
      const receipt = await tx.wait(2);
      console.log(receipt);
    }
    return;
  };

  return (
    <div style={styles.container}>
      <div>
        <Button type="primary" shape="round" onClick={handleClick}>
          Claim your new token!
        </Button>
      </div>
    </div>
  );
};