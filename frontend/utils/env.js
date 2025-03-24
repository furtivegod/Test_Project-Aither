import z from 'zod';

const createEnv = () => {
  const EnvSchema = z.object({
    APP_ENV: z
      .union([
        z.literal('development'),
        z.literal('uat'),
        z.literal('production'),
      ])
      .default('development'),
    API_URL: z.string(),
  });

  const envVars = Object.entries(import.meta.env).reduce((acc, curr) => {
    const [key, value] = curr;
    if (key.startsWith('VITE_APP_')) {
      acc[key.replace('VITE_APP_', '')] = value;
    }
    return acc;
  }, {});

  const parsedEnv = EnvSchema.safeParse(envVars);

  if (!parsedEnv.success) {
    throw new Error(
      `Invalid env provided.
The following variables are missing or invalid:
${Object.entries(parsedEnv.error.flatten().fieldErrors)
  .map(([k, v]) => `- ${k}: ${v}`)
  .join('\n')}`
    );
  }

  return parsedEnv.data;
};

export const env = createEnv();
