import React from "react";
import styled from "styled-components";
import { GithubContext, useGlobalContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = useGlobalContext();
  // console.log(repos);
  let languages = repos.reduce((accumulator, currentItem) => {
    const { language, stargazers_count } = currentItem;
    if (!language) return accumulator;
    if (!accumulator[language]) {
      accumulator[language] = {
        label: language,
        value: 1,
        star: stargazers_count,
      };
    } else {
      accumulator[language] = {
        ...accumulator[language],
        value: accumulator[language].value + 1,
        star: accumulator[language].star + stargazers_count,
      };
    }

    return accumulator;
  }, {});
  // console.log(languages);

  // Most used languages
  const mostUsed = Object.values(languages)
    .sort((a, b) => {
      return b.value - a.value;
    })
    .slice(0, 5); //
  // console.log(languages);

  // Most popular
  const mostPopular = Object.values(languages)
    .sort((a, b) => {
      return b.star - a.star;
    })
    .map((item) => {
      return { ...item, value: item.star };
    })
    .slice(0, 5);

  // console.log(mostPopular);

  let { stars, forks } = repos.reduce(
    (accumulator, currentItem) => {
      const { stargazers_count, name, forks } = currentItem;
      accumulator.stars[stargazers_count] = {
        label: name,
        value: stargazers_count,
      };
      accumulator.forks[forks] = { label: name, value: forks };
      return accumulator;
    },
    { stars: {}, forks: {} }
  );
  stars = Object.values(stars).slice(-5);
  forks = Object.values(forks).slice(-5);

  // console.log(forks);

  // const chartData = [
  //   {
  //     label: "HTML",
  //     value: "19",
  //   },
  //   {
  //     label: "CSS",
  //     value: "21",
  //   },
  //   {
  //     label: "JavaScript",
  //     value: "70",
  //   },
  // ];
  return (
    <section className="section">
      <Wrapper className="section-center">
        {/* <ExampleChart data={chartData} /> */}
        <Pie3D data={mostUsed} />
        <Column3D data={stars} />
        <Doughnut2D data={mostPopular} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
