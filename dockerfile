# Imagem base: Nginx, um servidor web leve
FROM nginx:alpine

# Remove os arquivos padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia todos os arquivos do seu projeto para a pasta que o Nginx serve
COPY . /usr/share/nginx/html

# Expõe a porta 80 (padrão HTTP)
EXPOSE 80

# Comando padrão do Nginx já roda automaticamente, não precisa de CMD