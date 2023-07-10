const checkIsNavigationSupported = () => {
	return Boolean(document.startViewTransition)
}

const fetchPage = async (url) => {
// Vamos a cargar la pagina de destino utilizando un fetch para obtener el HTML
	const response = await fetch(toUrl.pathname)// pagina en si
	const text = await response.text() // en este caso no queremos el json, y cambiamos json por texto plano, que es el html de la pagina (view-source)
	// queremos quedarnos con el html de la etiqueta body
	// usamos un regex
	const [, data] = text.match(/<body>([\s\S]*)<\/body>/i)
	return data
}

export const startViewTransition = () => {
	if (!checkIsNavigationSupported()) return
	window.navigation.addEventListener('navigate', (event) => {
		const toUrl = new URL(event.destination.url)
		// Si la pagina de destino (dominio) es diferente a la pagina de destino, hacemos return
		if (location.origin !== toUrl.origin) return
		// Si es una navegacion interna, interceptamos el evento
		event.intercept({
			async handler () {
				const data = await fetchPage(toUrl.pathname)
				// utilizar la api de View Transition API
				document.startViewTransition(() => {
					// Como se actualiza la vista
					document.body.innerHTML = data
					// el scroll hacia arriba del todo
					document.documentElement.scrollTop = 0
				})
			}
		})
	})
}