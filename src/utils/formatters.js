// normalizar el texto recibido quitando simbolos y reemplazandolos por " "
export const cleanFlavorText = (rawText) => {
  if (!rawText) return "";

  return rawText.replace(/\f/g, " ").replace(/\n/g, " ");
};
