FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY app/ /www/data/
COPY nginx/orderable.conf /etc/nginx/conf.d/

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
