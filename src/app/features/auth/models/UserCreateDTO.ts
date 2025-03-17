import { SpecialistCreateDTO } from "../../specialist/models/SpecialistCreateDTO";

export interface UserCreateDTO {
    email: string,
    password: string,
    specialistCreateDTO: SpecialistCreateDTO
}