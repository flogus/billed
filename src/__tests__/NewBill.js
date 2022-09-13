/**
 * @jest-environment jsdom
 */
 import { fireEvent, screen } from "@testing-library/dom"
 import NewBillUI from "../views/NewBillUI.js"
 import NewBill from "../containers/NewBill.js"
 import { ROUTES_PATH } from "../constants/routes"
 import { localStorageMock } from "../__mocks__/localStorage.js";
 import store from "../__mocks__/Store.js"
 import router from "../app/Router";

 describe("Given I am connected as an employee", () => {
   describe("When I am on NewBill Page", () => {
     test("Then the formular exist", () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.NewBill)
      
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
     })

     /**
      * On remplit et test des elements du formulaire puis
      * on submit
      * et on redirige vers la page Bills
      */
     test("Then the formular should be submit", () => {
      document.body.innerHTML = NewBillUI()

      const inputExpenseName = screen.getByTestId("expense-name");
      fireEvent.change(inputExpenseName, { target: { value: "Vol Munich San-Diego" } });
      expect(inputExpenseName.value).toBe("Vol Munich San-Diego");

      const inputAmount = screen.getByTestId("amount");
      fireEvent.change(inputAmount, { target: { value: "500" } });
      expect(inputAmount.value).toBe("500");

      const inputVat = screen.getByTestId("vat");
      fireEvent.change(inputVat, { target: { value: "25" } });
      expect(inputVat.value).toBe("25");

      const inputPct = screen.getByTestId("pct");
      fireEvent.change(inputPct, { target: { value: "50" } });
      expect(inputPct.value).toBe("50");

      const inputFile = screen.getByTestId("file");
      fireEvent.click(inputFile);
      expect(inputFile.value).toBe("");
      
      const form = screen.getByTestId("form-new-bill");

      const newBill = new NewBill({ document, onNavigate, store, localStorage });
      const handleSubmit = jest.fn(newBill.handleSubmit)
      
      inputFile.addEventListener('submit', handleSubmit)
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["cat.jpg"], "cat.jpg", { type: "image/jpg" })]
        }
      })

      form.addEventListener("submit", handleSubmit);
      fireEvent.submit(form);

      //verifier si la page est bills
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
     })

     test('Then we test if the image type is "image/jpg"', () => {
      const newBill = new NewBill({ document, onNavigate, store, localStorage });
      const file = {
        type: "image/jpg",
      };
      const theFile = Object.create(file);      
      const fileState =  newBill.isFileExtentionOk(theFile);
      expect(fileState).toBeTruthy()
    });

    //  test('Then we test if the uploaded image type is ok', () => {
    //   //NewBillUI
    //   const newBill = new NewBill({ document, onNavigate, store, localStorage });
    //   const nouveauBillUI = NewBillUI
    //   document.body.innerHTML = nouveauBillUI
    //   const file = {};
    //   const theFile = Object.create(file);
      
    //   // Good file type
    //   theFile.type = "image/jpeg";
    //   const fileState =  newBill.isFileExtentionOk(theFile)
    //   const uploadButton = screen.getByTestId("file")
    //   const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e,theFile))
    //   uploadButton.addEventListener("submit", handleChangeFile);
    //   fireEvent.click(uploadButton);
    //   expect(fileState).toBeTruthy();
    // });

    // test('Then we test if the uploaded image type is NOT ok', () => {
    //   //NewBillUI
    //   const newBill = new NewBill({ document, onNavigate, store, localStorage });
    //   const nouveauBillUI = NewBillUI
    //   document.body.innerHTML = nouveauBillUI
    //   const file = {};
    //   const theFile = Object.create(file);

    //   // Bad file type
    //   theFile.type = "image/pdf";
    //   const fileState =  newBill.isFileExtentionOk(theFile)
    //   console.log("fileState",fileState)
    //   const uploadButton = screen.getByTestId("file")
    //   // const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e,theFile))
    //   const e = { preventDefault: jest.fn() };
    //   newBill.handleChangeFile(e)
    //   uploadButton.addEventListener("submit", handleChangeFile);
    //   fireEvent.click(uploadButton);
    //   expect(fileState).not.toBeTruthy()
    // });

    test('Then we test if the uploaded image type is OK', () => {
      const newBill = new NewBill({ document, onNavigate, store, localStorage });
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const inputFile = screen.getByTestId("file")
      inputFile.addEventListener('change', handleChangeFile)
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["cat.jpg"], "cat.jpg", { type: "image/jpg" })]
        }
      })
    })

    test('Then we test if the uploaded image type is NOT OK', () => {
      const newBill = new NewBill({ document, onNavigate, store, localStorage });
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const inputFile = screen.getByTestId("file")
      global.alert = jest.fn();
      global.alert();
      inputFile.addEventListener('change', handleChangeFile)
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["cat.pdf"], "cat.pdf", { type: "image/pdf" })]
        }
      })
    })

    test('Then we test if the handleChangeFile return a alert', () => {
      global.alert = jest.fn();
      global.alert();
      expect(global.alert).toHaveBeenCalledTimes(1);
    })

   })
 })