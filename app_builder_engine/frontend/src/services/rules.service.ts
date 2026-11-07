import { apiClient } from './api-client';

export interface CodeValidationResponse {
  valid: boolean;
  violations: Array<{
    rule_id?: string;
    rule_name?: string;
    severity?: string;
    message?: string;
    detail?: string;
  }>;
}

export const rulesService = {
  validateCode: async (code: string): Promise<CodeValidationResponse> => {
    try {
      return await apiClient.post<CodeValidationResponse>('/api/v1/rules/validate', { code });
    } catch {
      // Fallback local static checks for Design System and Layering
      const violations: CodeValidationResponse['violations'] = [];
      if (code.includes('styled-components') || code.includes('@emotion/styled')) {
        violations.push({
          rule_id: 'rule-copan-ds-only',
          rule_name: 'Usar estritamente Copan Design System',
          severity: 'MANDATORY',
          message: 'Detectada biblioteca de estilo customizada (@emotion/styled-components). Utilize o Copan DS.',
        });
      }
      if (code.includes('fetch(') || code.includes('axios.')) {
        violations.push({
          rule_id: 'rule-api-contracts',
          rule_name: 'Contratos OpenAPI / Schemas Pydantic Obrigatórios',
          severity: 'MANDATORY',
          message: 'Chamadas HTTP diretas não encapsuladas no cliente tipado apiClient da aplicação.',
        });
      }
      return {
        valid: violations.length === 0,
        violations,
      };
    }
  },
};
