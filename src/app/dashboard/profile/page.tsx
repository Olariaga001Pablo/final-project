//dashboard/profile/page.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Parcela from "@/components/parcela";
import CantidadRecursos from "@/components/cantidad-recursos";
import { useSession } from "next-auth/react";
import axios from "axios";
import LogoutButton from "@/components/logout-button";
import MessageModal from "@/components/MessageModal";
import { Recurso, UserData } from "@/interfaces/tipos";

function ProfilePage() {
    const { data: session, status } = useSession();
    const [user, setUser] = useState<UserData | null>(null);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const userEmail = session?.user?.email;
    console.log(user?.fullname);
    const fetchData = async () => {
        try {
            /* const response = await axios.get(`/api/recursos`); */
            const response = await axios.get("/api/recursos");
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userEmail]);

    
    const nuevaConstruccion = async (pos: number, edificio: string): Promise<boolean> => {
        try {
            const response = await axios.post("/api/construirEdificio", {
                email: userEmail,
                edificio,
                pos,
            });
            if (response.status === 200) {
                await fetchData();
                return true;
            }
            else {
                // setUser(response.data);
                return false;
            }
        }
        catch (error) {
            return false;
        }
    }
    
    useEffect(() => {
        const intervalId = setInterval(() => {
            /* if (userEmail) {
                generarRecursos();
            } */
                generarRecursos();
        }, 60000);

        return () => clearInterval(intervalId);
    }, [userEmail]);
    async function generarRecursos() {
        try {
                await axios.post("/api/generarRecursos");
                await fetchData();
                console.log("Recursos generados");
        }
        catch (error) {
            // console.log("eeee");
            console.error(error);
        }
    }
    if (isLoading) {
        return <div>Cargando...</div>; // Muestra un estado de carga mientras los datos están siendo obtenidos
    }
    
    return (
        <div>
            <Image
                src="/background-buttons-v3.png"
                alt="Fondo azul"
                layout="fill"
                objectFit="cover"
                quality={100}
                className="z-0"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-transparent z-10">
                <div className="absolute top-28 right-28">
                    <LogoutButton />
                </div>

                <div className="absolute top-28 left-28">
                    <button
                        className="bg-transparent cursor-pointer transition-transform duration-500 ease-in-out transform hover:scale-110 px-2"
                        onClick={() => setIsMessageModalOpen(true)}
                    >
                        <Image
                            src="/boton-buzon.png"
                            alt="Icono buzon"
                            height={40}
                            width={40}
                            quality={100}
                        />
                    </button>
                    <MessageModal />

                </div>
                {/* <MessageModal 
                userEmail = {userEmail || ""}
                isOpen = {isMessageModalOpen}
                onClose = {() => setIsMessageModalOpen(false)}
                />  */}
                <div className="flex items-center flex-col gap-y-1">
                    {/* Asignar cada elemento de la lista a las parcelas */}
                    <div className="flex -mb-8">
                        {user?.edificios?.slice(0, 3).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index}
                                nuevaConstruccion={nuevaConstruccion}
                            // updateBuilding={updateBuilding}
                            />
                        ))}
                    </div>
                    <div className="flex">
                        {user?.edificios?.slice(3, 7).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index + 3}
                                nuevaConstruccion={nuevaConstruccion}
                            /* canAffordConstruction={canAffordConstruction}
                            updateBuilding={updateBuilding} */
                            />
                        ))}
                    </div>
                    <div className="flex -my-8">
                        {user?.edificios?.slice(7, 12).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index + 7}
                                nuevaConstruccion={nuevaConstruccion}

                            /* canAffordConstruction={canAffordConstruction}
                            updateBuilding={updateBuilding} */
                            />
                        ))}
                    </div>
                    <div className="flex">
                        {user?.edificios?.slice(12, 16).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index + 12}
                                nuevaConstruccion={nuevaConstruccion}

                            /* canAffordConstruction={canAffordConstruction}
                            updateBuilding={updateBuilding} */
                            />
                        ))}
                    </div>
                    <div className="flex -mt-8">
                        {user?.edificios?.slice(16, 19).map((edificio, index) => (
                            <Parcela
                                key={index}
                                estado={edificio.name}
                                pos={index + 16}
                                nuevaConstruccion={nuevaConstruccion}
                            /* canAffordConstruction={canAffordConstruction}
                            updateBuilding={updateBuilding} */
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-0 w-full z-20">
                {user?.recursos && <CantidadRecursos resources={user.recursos} />}
            </div>
        </div>
    );
}

export default ProfilePage;
