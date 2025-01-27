"use client"

import { createClient } from "@/utils/supabase/client";
import { Plus } from "lucide-react";
import { useState } from "react"

export default function AddPerson() {
    const [modal, setModal] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [name, setName] = useState<string | null>(null);

    const supabase = createClient();

    function toggleModal() {
        setModal(!modal);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name || !image) {
            alert("Preencha corretamente todos os campos!");
            return;
        }

        const { error: errorInsert } = await supabase.from('people').insert([{
            name: name,
            qtd: 0
        }])

        if (errorInsert) {
            console.log(errorInsert);
        }

        const { error } = await supabase
            .storage
            .from('images')
            .upload(name, image, {
                cacheControl: '3600',
                upsert: false
            })

        if (error) {
            console.log(error);
        }

        toggleModal();
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setImage(file);

        // Atualiza a pré-visualização da imagem
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
    };


    return modal ?
        (
            <div className="modal">
                <div className="overlay"></div>
                <div className="bg-zinc-100 flex flex-col w-fit h-fit p-10 text-zinc-900 rounded-lg align-self modal-content gap-2">
                    <h1 className="text-lg font-bold">👤 Adicionar pessoa</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium mb-1">
                                Nome:
                            </label>
                            <input
                                type="text"
                                id="name"
                                onChange={handleNameChange}
                                placeholder="Digite o nome"
                                className="w-full border p-2 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="image" className="block text-sm font-medium mb-1">
                                Foto:
                            </label>
                            <input
                                type="file"
                                id="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="w-full"
                            />
                            {preview && (
                                <div className="mt-2">
                                    <img src={preview} alt="Pré-visualização" className="max-w-full h-32 object-cover rounded" />
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
                        >
                            Adicionar
                        </button>
                    </form>
                    <button className="bg-red-400 text-zinc-200 font-bold px-4 py-2" onClick={toggleModal}> Cancalar</button>
                </div>
            </div>
        ) :
        (
            <button className="bg-zinc-200 rounded-[100px] text-zinc-800 px-10 py-2 flex flex-row gap-2 w-80 justify-center" onClick={toggleModal}>
                <Plus />
                Adicionar pessoa
            </button>
        )
}