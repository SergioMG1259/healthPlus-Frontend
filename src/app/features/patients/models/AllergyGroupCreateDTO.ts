import { AllergyRequestDTO } from "./AllergyRequestDTO";

export interface AllergyGroupCreateDTO {
    allergiesId: number[],
    customAllergiesNames: AllergyRequestDTO[]
}