
import { NextPage, GetServerSideProps } from 'next';
import { urqlClient } from '@/lib/gql-requests';
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
  try {
    const client = await urqlClient();
    const result = await client.query(DogsQuery, {}).toPromise();

    return {
      props: {
        dogs: result.data.dogs.nodes
      }
    }
  } catch(e) {
    return {
      notFound: true
    }
  }
}

export default Index;
