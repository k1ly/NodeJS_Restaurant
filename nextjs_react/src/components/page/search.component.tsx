import {Button, Form, InputGroup} from "react-bootstrap";

export function SearchComponent({search, setSearch, submit}: any) {
    return <div className={"d-flex justify-content-center my-2"}>
        <InputGroup className={"rounded-pill w-25"}>
            <Form.Control type={"search"} placeholder={"Введите запрос..."}
                          value={search}
                          onChange={(e: any) => setSearch(e.target.value)}/>
            <Button className={"btn btn-primary"} onClick={submit}>
                <svg width={25} height={25} viewBox={"0 0 24 24"}>
                    <path fill={"white"} stroke={"2"}
                          d={"m20.87 20.17-5.59-5.59A6.956 6.956 0 0 0 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7a6.995 6.995 0 0 0 11.58 5.29l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"}/>
                </svg>
            </Button>
        </InputGroup>
    </div>;
}