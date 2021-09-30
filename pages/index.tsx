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

        <p>
          IE11以外の<a href="#browsers">主要ブラウザ</a>
          がサポートしているウェブテクノロジー一覧
        </p>
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

        <p>
          <small>パーシャルサポートを含みます</small>
        </p>

        <a
          href={`https://caniuse.com/?compare=ie+11,edge+${edge},firefox+${firefox},chrome+${chrome},safari+${safari},ios_saf+${ios_saf},and_chr+${and_chr}&compareCats=all#results`}
        >
          Can I useでの全テクノロジー比較表
        </a>

        <h2 id="browsers">対象ブラウザ</h2>
        <ul>
          <li>Chrome v{chrome}</li>
          <li>Edge v{edge}</li>
          <li>Firefox v{firefox}</li>
          <li>Safari v{safari}</li>
          <li>iOS Safari v{ios_saf}</li>
          <li>Android Chrome v{and_chr}</li>
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
          <div>
            <dt>GitHub</dt>
            <dd>
              <a href="https://github.com/YusukeHirao/goodbye-ie">リポジトリ</a>
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

type Stat = "y" | `y ${string}` | "a" | `a ${string}` | "n" | "p";

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
    [browser: string]: { [version: string]: Stat };
  },
  b: { [browser: string]: number }
) {
  return (
    !supported(stats.ie[b.ie]) &&
    supported(stats.chrome[b.chrome]) &&
    supported(stats.edge[b.edge]) &&
    supported(stats.firefox[b.firefox]) &&
    supported(stats.safari[b.safari]) &&
    supported(stats.ios_saf[b.ios_saf]) &&
    supported(stats.and_chr[b.and_chr])
  );
}

function supported(stat: Stat) {
  return /^[ay]/.test(stat);
}
