"use client"

import { createClient } from "@/utils/supabase/client";
import { MinusCircle, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

type PersonProps = {
    name: string,
    img: string,
}

export default function PersonCard({ name, img }: PersonProps) {
    const [qtd, setQtd] = useState(0)
    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            const { data } = await supabase.from('people').select('qtd').eq('name', name).single()

            if (data) {
                setQtd(data.qtd)
            }
        }
        fetchData();
    }, [supabase, name])

    async function handleAdd() {
        await supabase.from('people').update({ qtd: qtd + 1 }).eq('name', name).select()
        setQtd(qtd + 1);
    }

    async function handleMinus() {
        await supabase.from('people').update({ qtd: qtd - 1 }).eq('name', name).select()
        setQtd(qtd - 1);
    }

    return (
        <div className="w-40 h-40 bg-zinc-600 rounded-md person-card flex">
            <img className="person-img" src={img} />
            <div className="person-content w-full h-full p-2 flex flex-row justify-between items-center">
                <button><MinusCircle onClick={handleMinus} /></button>
                <h1 className="flex align-center justify-content-center h-fit text-4xl">{qtd}</h1>
                <button><PlusCircle onClick={handleAdd} /></button>
            </div>
        </div>
    )
}