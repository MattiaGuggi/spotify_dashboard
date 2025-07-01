import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const navigate = useNavigate();
    const [activeOption, setActiveOption] = useState('Home');

    const redirectToPage = (page) => {
        setActiveOption(page);
        navigate(`/${page.toLowerCase()}`);
    };
    return (
        <nav>
            <button onClick={() => redirectToPage("")}>Login</button> |{" "}
            <button onClick={() => redirectToPage("top-tracks")}>Top Tracks</button> |{" "}
            <button onClick={() => redirectToPage("recommendations")}>Recommendations</button> |{" "}
            <button onClick={() => redirectToPage("playlists")}>Playlists</button>
        </nav>
    )
}

export default Navbar
