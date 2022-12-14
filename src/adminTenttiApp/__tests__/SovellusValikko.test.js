import { render, fireEvent, screen } from "@testing-library/react"
import axios from "axios"
import SovellusValikko from "../SovellusValikko"

jest.mock('axios')

//testilohko
test("kirjaudu painettu", () => {

    //tulostetaan komponentti, propsit voi lisätä komponentti kutsuun ikään kuin kutsu olisi normaaliajo
    render(<SovellusValikko />)

    //valitaan elementit joihin interaktiota
    const kirjauduButton = screen.getByTestId("kirjauduSisaan")

    //interaktio elementtien kanssa
    fireEvent.click(kirjauduButton);
    
    //assert the expected result
    expect(kirjauduButton).toBeUndefined()
})