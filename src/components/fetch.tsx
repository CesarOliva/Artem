import { useState, useEffect } from 'react';
import type { Artwork } from '../../types/artwork';

const Fetch = () => {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchArtworks = async () => { 
            try{
                setLoading(true);

                const response = await fetch('https://api.artic.edu/api/v1/artworks?limit=12&fields=id,title,artist_display,date_display,medium_display,image_id');

                if(!response.ok) throw new Error('Error: ' + response.status);

                const data = await response.json();

                setArtworks(data.data);
                setError(null);			
            }catch(err: any){
                setError(err.message)
                console.log("Error al obtener datos: " + err)
            } finally{
                setError(null);
                setLoading(false)
            }
        }

        fetchArtworks()
    }, [])

    if(loading) return(<p>Cargando</p>)

    if(error) return (<p>Error</p>)

    return (
        <div>
            {artworks.map((artwork: any) => (
                <p>{artwork.title}</p>
            ))}
        </div>
    );
}
 
export default Fetch;