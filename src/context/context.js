import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

export const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  const [request, setRequest] = useState(0);
  const [error, setError] = useState({ show: false, msg: "" });
  const [loading, setLoading] = useState(false);

  // Check number of remaining requests
  const checkRequest = async () => {
    try {
      const { data } = await axios(`${rootUrl}/rate_limit`);
      const remaining = data.rate.remaining;
      // const remaining = 0;
      // console.log(remaining);
      setRequest(remaining);
      if (remaining === 0) {
        setError({ show: true, msg: "Limit exceeded" });
      }
      // console.log(data.rate);
    } catch (error) {
      console.log(error);
    }
  };

  // Search for user
  const searchUser = async (user) => {
    setLoading(true);
    if (request > 0) {
      try {
        const userInfo = await axios(`${rootUrl}/users/${user}`);

        setGithubUser(userInfo.data);
        // console.log(userInfo.data);
        const { login, repos_url, followers_url } = userInfo.data;
        // Find followers
        const followersInfo = await axios(`${followers_url}?per_page=100`);
        setFollowers(followersInfo.data);

        // Find repos
        const reposInfo = await axios(`${repos_url}?per_page=100`);
        setRepos(reposInfo.data);

        setLoading(false);
        checkRequest();
        setError({ show: false, msg: "" });
      } catch (error) {
        setError({ show: true, msg: "User not found" });
      }
    } else {
      setError({ show: true, msg: "Limit exceeded" });
    }
    setLoading(false);
  };

  // UseEffect
  useEffect(() => {
    checkRequest();
  }, [request]);

  return (
    <GithubContext.Provider
      value={{
        githubUser,
        repos,
        followers,
        request,
        error,
        searchUser,
        loading,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(GithubContext);
};
