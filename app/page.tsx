import AddPerson from "@/components/AddPerson";
import PersonCard from "@/components/PersonCard";
import { createClient } from "@/utils/supabase/server";

type Person = {
  name: string,
  qtd: number
}

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase.from('people').select();

  function getPublicUrl(name: string) {
    const { data, error } = supabase.storage.from('images').getPublicUrl('/' + name);

    if (error) {
      console.log(error.message)
    }

    return data.publicUrl;
  }

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <h1 className="text-3xl font-bold">🍕 Santo Rango</h1>
      <div className="flex flex-row gap-4 m-6 w-fit">
        {data.map((p: Person) => (
          <div key={p.name}>
            <PersonCard name={p.name} img={getPublicUrl(p.name)} />
          </div>
        ))}
      </div>
      <AddPerson />
    </div>
  );
}
