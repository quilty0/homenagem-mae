# Para a melhor mãe do mundo

Homenagem estática com carta, música e um criador de links personalizados.

## Rodar localmente

Com Python instalado, execute na raiz do projeto e abra `http://localhost:8000`.

```sh
python -m http.server 8000
```

## Personalizar e publicar

Abra **Criar minha homenagem** para preencher os campos, conferir a prévia e copiar o link. Quem receber o link verá a carta ao tocar em **Sim!**. O nome, a assinatura e a dedicatória fazem parte do endereço compartilhado.

Edite o título e a dedicatória padrão em `index.html`. Para trocar a faixa, substitua `assets/musica.mp3` e atualize os créditos em `index.html`. Os estilos ficam em `styles.css`.

Em uma hospedagem estática, publique a raiz do projeto, incluindo `assets/`. Crie o link personalizado a partir do endereço público para compartilhá-lo.
