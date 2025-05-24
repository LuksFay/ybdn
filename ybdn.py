from pytubefix import YouTube  # Usa pytubefix en lugar de pytube
# Si prefieres pytube, cambia la línea anterior a: from pytube import YouTube

# Solicitar la URL al usuario
url = input("Pega la URL del video de YouTube: ")

try:
    # Crear objeto YouTube con la URL proporcionada
    video = YouTube(url)
    
    # Mostrar título del video
    print(f"Descargando: {video.title}")
    
    # Obtener la stream de mayor resolución
    video_stream = video.streams.get_highest_resolution()
    
    # Verificar si se encontró una stream válida
    if video_stream:
        # Descargar el video
        video_stream.download()
        print("¡Descarga completada!")
    else:
        print("No se encontró una stream válida para descargar.")
        
except Exception as e:
    print(f"Ocurrió un error: {str(e)}")
    print("Asegúrate de que la URL sea válida y que el video esté disponible.")
    print("Si el problema persiste, intenta actualizar pytubefix: pip install --upgrade pytubefix")