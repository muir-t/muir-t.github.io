import * as React from "react";

import { Profile } from "./Profile";

import "./Home.less";

const Title = () => (
  <>
    <h1>Tom Muir</h1>
    <h2>
      <a href="https://github.com/muir-t">GitHub</a>
      {" - "}
      <a href="https://www.linkedin.com/in/thomas-muir-468ba5145">LinkedIn</a>
    </h2>
  </>
);

export const Home = () => (
  <div className="top">
    <section className="header">
      <Title />
    </section>
    <section className="content">
      <Profile />
    </section>
  </div>
);
