import React, { useState, useEffect } from "react";
import * as client from "../users/client";

function Profile() {
  const [account, setAccount] = useState(null);
  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
  };
  useEffect(() => {
    fetchAccount();
  }, []);
  return (
    <div>
      {account ? (
        <p className="user-title">You are logged in</p>
      ) : (
        <p className="user-title">Please login</p>
      )}
    </div>
  );
}

export default Profile;
