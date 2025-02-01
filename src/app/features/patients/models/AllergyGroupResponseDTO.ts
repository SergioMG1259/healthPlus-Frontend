import { Allergy } from "./Allergy";
import { CustomAllergy } from "./CustomAllergy";

export interface AllergyGroupResponseDTO {
    allergies: Allergy[],
    customAllergies: CustomAllergy[]
}