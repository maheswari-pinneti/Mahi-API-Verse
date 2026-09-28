/**
 * PHASE 5: VALIDATORS
 * 
 * Pipeline Stage: Validate
 * 
 * Uses Zod schemas to ensure that the output from the Normalizer
 * is 100% compliant before being saved or passed to the database.
 */
import { ApiRecordSchema, ApiRecord } from '@mahi-api-verse/schemas';

export class ApiValidator {
  public validate(record: any): { valid: boolean; data?: ApiRecord; errors?: any } {
    const result = ApiRecordSchema.safeParse(record);
    
    if (result.success) {
      return { valid: true, data: result.data };
    } else {
      console.error(`❌ Validation Failed for API: ${record.id}`);
      return { valid: false, errors: result.error.errors };
    }
  }
}
