/**
 * @jest-environment jsdom
 */
import { fireEvent, screen, waitFor } from "@testing-library/dom"
import BillsUI, { loading, error } from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import Bills from "../containers/Bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store"
import router from "../app/Router.js";
jest.mock("../app/store", () => mockStore)

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
            const theBills = new Bills({ document, onNavigate, store: mockStore, localStorage })
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
            const theBills = new Bills({ document, onNavigate, store: mockStore, localStorage })
            const theBillsList = theBills.getBills();
            const theBillsMock = mockStore.bills().list();
            expect(theBillsList).toEqual(theBillsMock)
        });
        test('Then we click on the button "Nouvelle note de frais"', () => {
            const mockStore = null
            const onNavigate = (pathname) => {
                document.body.innerHTML = ROUTES({ pathname })
            }
            const bills = new Bills({ document, onNavigate, store: mockStore, localStorage })
                // The UI
            const pageUI = BillsUI({ data: bills, loading, error });
            document.body.innerHTML = pageUI
            const newBillButton = screen.getByTestId('btn-new-bill')
            const handleClickNewBill = jest.fn(bills.handleClickNewBill())
            newBillButton.addEventListener("click", handleClickNewBill)
            fireEvent.click(newBillButton)
            expect(handleClickNewBill).toHaveBeenCalled()
        });

        test("It should fetches bills to an API without error", async() => {
            const expectedBill = {
                "id": "47qAXb6fIm2zOKkLzMro",
                "vat": "80",
                "fileUrl": "https://firebasestorage.googleapis.com/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a",
                "status": "pending",
                "type": "Hôtel et logement",
                "commentary": "séminaire billed",
                "name": "encore",
                "fileName": "preview-facture-free-201801-pdf-1.jpg",
                "date": "2004-04-04",
                "amount": 400,
                "commentAdmin": "ok",
                "email": "a@a",
                "pct": 20
            }
            const sentedBill = await mockStore.bills().update()
            expect(sentedBill).toMatchObject(expectedBill)
        });
    })

    describe("When an error occurs on API", () => {
        beforeEach(() => {
            jest.spyOn(mockStore, "bills")
            Object.defineProperty(
                window,
                'localStorage', { value: localStorageMock }
            )
            window.localStorage.setItem('user', JSON.stringify({
                type: 'Employee'
            }))
            const root = document.createElement("div")
            root.setAttribute("id", "root")
            document.body.appendChild(root)
            router()
        })
        test("Then it should fetches bills from an API and fails with 404 message error", async() => {
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 404"))
                    }
                }
            })
            window.onNavigate(ROUTES_PATH.Bills)
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 404/)
            expect(message).toBeTruthy()
        })

        test("Then it should fetches messages from an API and fails with 500 message error", async() => {
            mockStore.bills.mockImplementationOnce(() => {
                return {
                    list: () => {
                        return Promise.reject(new Error("Erreur 500"))
                    }
                }
            })
            window.onNavigate(ROUTES_PATH.Bills)
            await new Promise(process.nextTick);
            const message = await screen.getByText(/Erreur 500/)
            expect(message).toBeTruthy()
        })
    })
})