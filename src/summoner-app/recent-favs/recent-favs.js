import React, { useState, useEffect } from "react";
import * as client from "../users/client";
import "./recent-favs.css";

function RecentFavs() {
  const [account, setAccount] = useState(null);
  const [favUsers, setFavUsers] = useState([]);

  const fetchAccount = async () => {
    const account = await client.account();
    setAccount(account);
    const favs = account.favoriteUsers;
    setFavUsers(favs);
    if (favs) {
      const newFavs = [...account.favoriteUsers].reverse();
      if (newFavs.length > 3) {
        setFavUsers(newFavs.slice(0, 3));
      } else {
        setFavUsers(newFavs);
      }
    }
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  return (
    <div className="fav-users-container align-items-center m-auto mt-5 pt-1 rounded-3">
      {account ? (
        <div className="align-items-center m-auto mt-2 pb-3 px-3">
          {favUsers && favUsers.length === 0 ? (
            <p className="fav-users-label text-align-center mb-0">
              You have no recent favorites
            </p>
          ) : (
            <div className="d-flex flex-column align-items-center">
              <p className="fav-users-label text-align-center mb-0">Recent Favorites</p>
              {favUsers.map((favUser, index) => (
                <a
                  key={index}
                  style={{ display: "block", width: "fit-content" }}
                  href={`/profile/${favUser.userId}`}
                  className="favorite-user-link"
                >
                  {favUser.username}
                </a>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="py-2">
          <p className="fav-users-label mb-1">Sign in to view your recent favorites</p>
        </div>
      )}
    </div>
  );
}

export default RecentFavs;
