"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
const API_BASE_URL = "http://localhost:8000";

// LOS COMENTARIOS SON PARA SABER QUE ES LO QUE ANDO HACIENDO, ES PARA NO PERDERME CUANDO LO VUELVA A LEER

export default function StudentDetail() {
    const params = useParams(); // extraer el id del estudiante desde la url usando el hook useparams de next.js
    const router = useRouter(); // hook para navegacion programatica

    // estados para manejar los datos del estudiante, loading y errores
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // funcion asincrona para cargar los datos de un estudiante especifico
        const loadStudent = async () => {
            try {
                // hacer peticion get al endpoint del estudiante usando el id de la url
                const res = await fetch(`${API_BASE_URL}/students/${params.id}/`);
                if (!res.ok) {
                    throw new Error("estudiante no encontrado");
                }
                const data = await res.json();
                setStudent(data); // guardar los datos del estudiante en el estado
            } catch (error) {
                setError(error.message); // guardar el mensaje de error
            } finally {
                setLoading(false); // cambiar loading a false cuando termine la peticion
            }
        };

        // solo ejecutar si existe un id en los parametros de la url
        if (params.id) {
            loadStudent();
        }
    }, [params.id]); // dependencia: se ejecuta cuando cambia el id en la url

    //evitar que se renderice antes de tener los datos (o sea cuando el estudiante sea null)
    if (loading || !student) {
        return (
            <div className="container mx-auto p-4">
                <p>Cargando estudiante...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto p-4">
                <div className="text-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
                <p>{error}</p>
                {/* boton para regresar a la pagina principal (lista de estudiantes) usando el router de next.js */}
                <Button onClick={() => router.push("/")} className="mt-4 cursor-pointer">
                    Volver al listado
                </Button>
                </div>
            </div>
            );
    }

    return (
        <div className="container mx-auto p-4">
            <div className="mb-4">
                <Button className="cursor-pointer" onClick={() => router.push("/")} variant="outline">
                    Volver al listado
                </Button>
            </div>

            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                <CardTitle className="text-3xl">{student.full_name}</CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Información Personal</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-gray-600">Nombre completo</label>
                                <p className="text-lg">{student.full_name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-600">Código</label>
                                <p className="text-lg font-mono">{student.code}</p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-sm font-medium text-gray-600">Email</label>
                                <p className="text-lg">
                                    <a href={`mailto:${student.email}`} className="text-blue-600 hover:underline">
                                        {student.email}
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Grupo</h3>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-lg font-medium">{student.group.name}</p>
                            <p className="text-sm text-gray-600">Sala {student.group.room_number}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}