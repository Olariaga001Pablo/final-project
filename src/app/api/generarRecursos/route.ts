import { connectDB } from "@/libs/mongodb";
import { getServerSession } from "next-auth";
import User from "@/models/user";
import mongoose from "mongoose";
import next, { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { Recurso, UserData } from "@/interfaces/tipos";
import {OPTIONS} from "@/app/api/auth/[...nextauth]/route";

export default async function handler() {
  try {
    await connectDB();
    
    // Obtener la sesión del servidor
    const session = await getServerSession(OPTIONS );

    // Verificar si la sesión y el usuario están presentes
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    const userSession = session.user as UserData;
    const id = userSession._id;

    // Buscar al usuario en la base de datos
    const user = await User.findOne({ _id: id });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Calcular los recursos generados según los edificios del usuario
    const recursosGenerados = {
      oro: 0,
      comida: 0,
      piedra: 0,
      madera: 0,
      tropas: 0,
    };

    for (const edificio of user.edificios) {
      switch (edificio.name) {
        case "Granja":
          recursosGenerados.comida += edificio.level * 10;
          break;
        case "Mina":
          recursosGenerados.oro += edificio.level * 10;
          break;
        case "Aserradero":
          recursosGenerados.madera += edificio.level * 10;
          break;
        case "Cantera":
          recursosGenerados.piedra += edificio.level * 10;
          break;
        case "Cuartel":
          recursosGenerados.tropas += edificio.level * 1;
          break;
        case "Urbano":
          recursosGenerados.oro += edificio.level * 5;
          recursosGenerados.comida += edificio.level * 5;
          recursosGenerados.madera += edificio.level * 5;
          recursosGenerados.piedra += edificio.level * 5;
          break;
        default:
          break;
      }
    }

    // Actualizar los recursos del usuario en la base de datos
    user.recursos.forEach((recurso: Recurso) => {
      switch (recurso.name) {
        case "oro":
          recurso.quantity += recursosGenerados.oro;
          break;
        case "comida":
          recurso.quantity += recursosGenerados.comida;
          break;
        case "piedra":
          recurso.quantity += recursosGenerados.piedra;
          break;
        case "madera":
          recurso.quantity += recursosGenerados.madera;
          break;
        case "tropas":
          recurso.quantity += recursosGenerados.tropas;
          break;
        default:
          break;
      }
    });

    // Guardar los cambios en la base de datos
    const updatedUser = await user.save();

    // Retornar los recursos actualizados como respuesta
    return NextResponse.json(updatedUser.recursos, { status: 200 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: error.message },
        { status: 400 }
      );
    }
    return NextResponse.error();
  }
}
