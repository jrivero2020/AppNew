import { Item, React, Box } from './constantesMui'
import { useNavigate } from 'react-router-dom';
import poster from './../images/poster.jpg'
import vuelta from './../images/vueltaAClases.jpg'
import './../css/myStyle.css'


function historia() {
    const navigate = useNavigate();

    return (
        <Item sx={{ bgcolor: 'transparent', border: '1px solid',alignItems: 'center', justifyContent: 'center'  }}>
            <Box  sx={{position: 'sticky', paddingBottom: '50%', objectFit: 'cover' }}>
                <img
                    src={vuelta}
                    alt="placeholder"
                    style={{ position: 'absolute',  height: '90%' }}
                />
            </Box>
        </Item>

    )
}

export default historia


/*

        */