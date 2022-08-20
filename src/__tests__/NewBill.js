/**
 * @jest-environment jsdom
 */

import { getByTestId } from '@testing-library/dom'
import { toHaveClass } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
    describe("When I am on NewBill Page", () => {
        test("and the layout icon is active", () => {
            // const html = NewBillUI()
            const html = "<div id='layout-icon1' data-testid='icon-window' class='active-icon'></div>";

            document.body.innerHTML = html
            const component = document.getByTestId('icon-window');
            console.log('component', component)
            expect(component).toHaveClass('.active-icon');
        })
    })
})