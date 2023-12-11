
import { NextPage, GetServerSideProps } from 'next';
import { urqlClient } from '../../../graphql/lib/gql-requests';
import { gql } from 'urql';

type Dog = {
  id: number
  name: string
}

type Props = {
  dogs: Dog[]
};

const DogsQuery = gql`
  query dogs {
    dogs {
      nodes {
        id
        name
      }
    }
  }`;

const Index: NextPage<Props> = (props) => {
  return (
    <main className={`flex min-h-screen flex-col items-center justify-between p-24`}>
      {
        props.dogs.map((dog: Dog) => (
          <div key={dog.id}>
            <p>{dog.id}: {dog.name}</p>
          </div>
        )
        )
      }
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const client = await urqlClient();
  const result = await client.query(DogsQuery, {}).toPromise();

  if (result.error) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      dogs: result.data.dogs.nodes
    }
  }
}

export default Index;
