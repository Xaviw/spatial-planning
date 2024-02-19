#!/bin/bash
nginx og daemon off;

pnpm migrate:prod;

pnpm start-backend:prod;
