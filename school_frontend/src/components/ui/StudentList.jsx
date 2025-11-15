"use client";
import { useState, useEffect } from 'react';
import { 
    Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious, 
} from "@/components/ui/pagination";
import CreateStudentDialog from "@/components/ui/createStudentDialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const API_BASE_URL = "http://localhost:8000";

// LOS COMENTARIOS SON PARA SABER QUE ES LO QUE ANDO HACIENDO, ES PARA NO PERDERME CUANDO LO VUELVA A LEER

export default function StudentList() {
    // estados para manejar la lista de estudiantes y paginacion
    const [students, setStudents] = useState([]); // array de estudiantes de la pagina actual
    const [currentPage, setCurrentPage] = useState(1); // pagina actual (empieza en 1)
    const [totalPages, setTotalPages] = useState(1); // total de paginas calculado
    const [nextPage, setNextPage] = useState(null); // url de la siguiente pagina (del backend)
    const [previousPage, setPreviousPage] = useState(null); // url de la pagina anterior (del backend)
    const [loading, setLoading] = useState(false); // estado de carga
    const router = useRouter(); // hook de next.js para navegacion

    // funcion asincrona que carga estudiantes de una pagina especifica
    const loadStudents = async (page = 1) => {
        setLoading(true); // mostrar indicador de carga
        try {
            // peticion get con parametro de pagina
            const res = await fetch(`${API_BASE_URL}/students/?page=${page}`);
            const data = await res.json();

            // actualizar estados con la respuesta del backend
            setStudents(data.results || []); // los estudiantes de esta pagina
            setTotalPages(Math.ceil(data.count / 10)); // calcular total de paginas (count / page_size)
            setNextPage(data.next); // url completa de la siguiente pagina
            setPreviousPage(data.previous); // url completa de la pagina anterior
            setCurrentPage(page); // actualizar pagina actual
        } catch (error) {
            console.error("error extrayendo estudiantes:", error);
        } finally {
            setLoading(false); // ocultar indicador de carga
        }
    };

    // useeffect que carga la primera pagina al montar el componente
    useEffect(() => {
        loadStudents(currentPage); // cargar la primera pagina
    }, []); // array vacio = solo se ejecuta al montar

    // funcion que maneja el cambio de pagina desde los botones de paginacion
    const handlePageChange = (page) => {
        loadStudents(page); // cargar la nueva pagina
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Lista de estudiantes</h1>
            <div className ="mb-4">
                <CreateStudentDialog onStudentCreated={() => loadStudents(currentPage)} />
            </div>
            {loading ? (
                <p>Cargando estudiantes...</p>
            ): (
                <ul className="space-y-2 mb-4">
                    {students.map((student) => (
                        <li key={student.code} className="p-4 border rounded flex justify-between items-center">
                            <div>
                                <div className ="font-semibold"> {student.full_name} </div>
                                <div className="text-sm text-gray-600"> {student.email} </div>
                                <div className="text-sm text-gray-600">Codigo: {student.code}</div>
                            </div>
                            {/* navegar a la pagina de detalle del estudiante usando su id */}
                            <Button className="cursor-pointer" variant="outline" size="sm" onClick={() => router.push(`/students/${student.id}`)}>
                                Ver detalles
                            </Button>
                        </li>
                    ))}
                </ul>
            )}

            {/* componente de paginacion de shadcn/ui */}
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        {/* boton "pagina anterior" - solo funciona si hay pagina anterior */}
                        <PaginationPrevious
                            onClick={() => previousPage && handlePageChange(currentPage - 1)}
                            // si no hay pagina anterior (previouspage es null), deshabilitar el boton
                            className={!previousPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>

                    <PaginationItem>
                        {/* boton "pagina siguiente" - solo funciona si hay pagina siguiente */}
                        <PaginationNext
                            onClick={() => nextPage && handlePageChange(currentPage + 1)}
                            // si no hay pagina siguiente (nextpage es null), deshabilitar el boton
                            className={!nextPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    )
}