import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage<{ db: any; date: string; version: string }> = ({
  db,
  date,
  version,
}) => {
  const ie = browserLatestVersion(db.agents.ie);
  const chrome = browserLatestVersion(db.agents.chrome);
  const edge = browserLatestVersion(db.agents.edge);
  const firefox = browserLatestVersion(db.agents.firefox);
  const safari = browserLatestVersion(db.agents.safari);
  const ios_saf = browserLatestVersion(db.agents.ios_saf);
  const and_chr = browserLatestVersion(db.agents.and_chr);

  const browsers = { ie, chrome, edge, firefox, safari, ios_saf, and_chr };

  const now = new Date(date);

  return (
    <div>
      <Head>
        <title>Goodbye IE</title>
        <meta
          name="description"
          content="IE11以外の主要ブラウザがサポートしているウェブテクノロジー一覧 from &qote;Can I use&qote;"
        />
      </Head>

      <main>
        <h1>Goodbye IE</h1>

        <p>IE11以外の主要ブラウザがサポートしているウェブテクノロジー一覧</p>
        <p>
          データは
          <a href="https://caniuse.com/">Can I use</a>の
          <a href="https://www.npmjs.com/package/caniuse-db">caniuse-db</a>
          より取得しています。
        </p>

        <ul>
          {Object.entries(db.data).map(([name, data]: [string, any], i1) => {
            if (check(data.stats, browsers)) {
              return (
                <li key={name}>
                  {data.categories.map((cat: string, i2: number) => (
                    <span
                      className="category-label"
                      key={`${i1}-${i2}_${name}_${cat}`}
                    >
                      {cat}
                    </span>
                  ))}
                  <a href={`https://caniuse.com/${name}`}>{data.title}</a>
                </li>
              );
            }
            return null;
          })}
        </ul>
      </main>
      <footer>
        <dl>
          <div>
            <dt>ビルド日時</dt>
            <dd>
              <time dateTime={now.toISOString()}>
                {now.toLocaleDateString("ja") +
                  " " +
                  now.toLocaleTimeString("ja")}
              </time>
            </dd>
          </div>
          <div>
            <dt>caniuse-db</dt>
            <dd>
              <a href="https://www.npmjs.com/package/caniuse-db">v{version}</a>
            </dd>
          </div>
        </dl>
      </footer>
    </div>
  );
};

export default Home;

export async function getStaticProps() {
  const db = require("caniuse-db/data.json");
  const version = require("caniuse-db/package.json").version;
  const date = new Date().toJSON();
  return { props: { db, date, version } };
}

function browserLatestVersion(browser: { versions: (string | null)[] }) {
  const versions = browser.versions.slice().reverse().slice(3);
  for (const version of versions) {
    if (version) {
      return parseInt(version);
    }
  }
  return 0;
}

function check(
  stats: {
    [browser: string]: { [version: string]: "y" | "n" | "y x" };
  },
  b: { [browser: string]: number }
) {
  return (
    stats.ie[b.ie] === "n" &&
    stats.chrome[b.chrome] !== "n" &&
    stats.edge[b.edge] !== "n" &&
    stats.firefox[b.firefox] !== "n" &&
    stats.safari[b.safari] !== "n" &&
    stats.ios_saf[b.ios_saf] !== "n" &&
    stats.and_chr[b.and_chr] !== "n"
  );
}
