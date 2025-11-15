"use client";
import { useState, useEffect, use } from "react";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@/components/ui/select";

const API_BASE_URL = "http://localhost:8000";

// LOS COMENTARIOS SON PARA SABER QUE ES LO QUE ANDO HACIENDO, ES PARA NO PERDERME CUANDO LO VUELVA A LEER

export default function CreateStudentDialog( {onStudentCreated} ) {
    const [open, setOpen] = useState(false); // estado para controlar si el dialog esta abierto o cerrado
    const [loading, setLoading] = useState(false); // estado para mostrar loading durante el envio del formulario
    const [groups, setGroups] = useState([]); // estado para almacenar la lista de grupos disponibles (cargados del backend)
    const [formData, setFormData] = useState({ // estado para manejar todos los datos del formulario en un solo objeto
        full_name: "",
        code: "",
        email: "",
        group: "",
    });

    // useeffect para cargar la lista de grupos disponibles desde el backend
    useEffect(() => {
        const loadGroups = async () => {
            try {
                // peticion get para obtener todos los grupos de estudiantes
                const res = await fetch(`${API_BASE_URL}/student-groups/`);
                const data = await res.json();
                setGroups(data); // guardar los grupos en el estado
            } catch (error) {
                console.error("error cargando los grupos de estudiantes:", error);
            }
        };
        loadGroups(); // ejecutar la funcion inmediatamente
    }, []);

    // funcion para actualizar un campo especifico del formulario
    // recibe el nombre del campo y el nuevo valor
    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev, // mantener todos los valores anteriores
            [field]: value // actualizar solo el campo especificado
        }))
    }

    // funcion que maneja el envio del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevenir el comportamiento por defecto del form
        setLoading(true); // mostrar indicador de carga

        try {
            // enviar peticion post al backend con los datos del formulario
            const res = await fetch(`${API_BASE_URL}/students/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json", // indicar que enviamos json
                },
                body: JSON.stringify(formData), // convertir el objeto formdata a json
            });

            if (res.ok) {
                // si la creacion fue exitosa:
                setOpen(false); // cerrar el dialog
                // limpiar el formulario para la proxima vez
                setFormData({
                    full_name: "",
                    email: "",
                    code: "",
                    group: "",
                });
                onStudentCreated(); // llamar funcion callback para refrescar la lista de estudiantes
            } else {
                console.error("error creando el estudiante");
            }
        } catch (error) {
            console.error("error creando el estudiante:", error);
        } finally {
            setLoading(false); // ocultar indicador de carga
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="cursor-pointer">Crear Estudiante</Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Crear nuevo estudiante</DialogTitle>
                    <DialogDescription>
                        Complete el formulario para crear un nuevo estudiante, todos los campos son obligatorios
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Nombre completo</label>
                        <Input
                            placeholder="Nombre completo"
                            value={formData.full_name}
                            onChange={(e) => handleInputChange("full_name", e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Email</label>
                            <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="correo@ejemplo.com"
                            required
                            />
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium">Código</label>
                            <Input
                            value={formData.code}
                            onChange={(e) => handleInputChange("code", e.target.value)}
                            placeholder="Código del estudiante"
                            required
                            />
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium">Grupo</label>
                        <Select
                            value={formData.group}
                            onValueChange={(value) => handleInputChange("group", value)}
                            required
                        >
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un grupo" />
                        </SelectTrigger>
                        <SelectContent>
                            {groups.map((group) => (
                                <SelectItem key={group.id} value={group.id.toString()}>
                                    {group.name} (Sala {group.room_number})
                                </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                    </div>

                    <div className = "flex justify-end space-x-2">
                        {/* cerrar el dialog sin guardar cambios, cambiando el estado open a false */}
                        <Button className="cursor-pointer" type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancelar
                        </Button>
                        
                        <Button className="cursor-pointer" type="submit" disabled={loading}>
                            {loading ? "Creando..." : "Crear estudiante"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}