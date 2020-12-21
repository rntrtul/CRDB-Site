import axios from "axios";
import Head from "next/head";
import SpellTable from "../../components/Table/spellTable";

function SpellDetail({ spell }) {
  let above_cast = 0;
  spell.casts.map(
    casting => casting.cast_level > spell.level && above_cast++
  );
  return (
    <div className="content">
      <Head>
        <title>CRDB | {spell.name}</title>
      </Head>
      <p className="title">{spell.name}</p>
      <p className="subtitle">
        {spell.cantrip === true && <span>Cantrip</span>}
        {spell.cantrip === false && <span>Level: {spell.level}</span>}
      </p>
      <p>Total casts: {spell.casts.length}</p>
      <p>Times cast above level: {above_cast} </p>
      <h5 className="heading">Top Casters:</h5>
      <ol>
        {spell.top_users.map((rank) => (
          <li>
            {rank[0]} ({rank[1]})
          </li>
        ))}
      </ol>
      <SpellTable data={spell.casts} />
    </div>
  );
}

export async function getStaticPaths() {
  const data = (await axios.get(`${process.env.DB_HOST}/spells/api/spell`)).data;
  const paths = data.results.map((spell) => ({
    params: { id: spell.id.toString() },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const spell = (
    await axios.get(`${process.env.DB_HOST}/spells/api/spell/${params.id}`)).data;

  return { props: { spell }, revalidate: 3 };
}

export default SpellDetail;
