FROM nginx:1.9.9

RUN rm /etc/nginx/conf.d/default.conf

COPY build/ /www/data/
COPY nginx/orderable.conf /etc/nginx/conf.d/

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
