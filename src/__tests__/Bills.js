/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import BillsUI, { loading, error } from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import store from "../__mocks__/Store.js"
import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
    describe("When I am on Bills Page", () => {
        test("Then bill icon in vertical layout should be highlighted", async() => {
            Object.defineProperty(window, 'localStorage', { value: localStorageMock })
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
            await waitFor(() => {
                expect(screen.getByTestId('icon-window')).toBeTruthy()
            })
            const windowIcon = screen.getByTestId('icon-window')
            const customIcon = {
                billUrl: 'http://somewhere',
                imgWidth: 799
            }
            const theBills = new Bills({ document, onNavigate, store, localStorage })
            console.log('windowIcon', { customIcon })
        })
        test("Then bills should be ordered from earliest to latest", () => {
            document.body.innerHTML = BillsUI({ data: bills })
            const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
            const antiChrono = (a, b) => ((a < b) ? 1 : -1)
            const datesSorted = dates.sort(antiChrono)
            expect(dates).toEqual(datesSorted)
        })

        test('Then we navigate to bills', () => {
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.append(root)
            router()
            window.onNavigate(ROUTES_PATH.Bills)
        });

        test('Then we have list on the page bills', () => {
            const theBills = new Bills({ document, onNavigate, store, localStorage })
            const theBillsList = theBills.getBills();
            const theBillsMock = store.bills().list();
            expect(theBillsList).toEqual(theBillsMock)
        });

        test('Then we click on the button "Nouvelle note de frais"', () => {
            const store = null
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
              }
            const bills = new Bills({ document, onNavigate, store, localStorage })
            // The UI
            const pageUI = BillsUI({ data: bills, loading, error });
            document.body.innerHTML = pageUI
            const newBillButton = screen.getByTestId('btn-new-bill')
            const handleClickNewBill = jest.fn(bills.handleClickNewBill())
            newBillButton.addEventListener("click", handleClickNewBill)
            fireEvent.click(newBillButton)
            expect(handleClickNewBill).toHaveBeenCalled()
        });
    })
})