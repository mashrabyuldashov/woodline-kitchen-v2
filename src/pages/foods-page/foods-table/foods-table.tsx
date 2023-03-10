import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { IFood, IFoodProps } from "../../../interfaces/foods.interfaces";
import { useContext, useEffect, useState } from "react";
import { ICategory } from "../../../interfaces/categorys.interfaces";
import { ReloadContext } from "../../../context/reload.context";
import { Button, ButtonGroup } from "@mui/material";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { ChangeFoodModal } from "../change-price-modal/change-price-modal";
import { getCategory } from "../../../services/api";
import accounting from "accounting";
import { AddFoodProductModal } from "../food-product-modal/food-product-modal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export const FoodsTable: React.FC<IFoodProps> = (props) => {
  const foods: IFood[] = props.foods as any;
  const [ctgs, setCtgs] = useState<ICategory[]>([]);
  const [changeOpen, setChangeOpen] = useState<boolean>(false);
  const [prodOpen, setProdOpen] = useState<boolean>(false);
  const [oldCost, setOldCost] = useState<number>();
  const [id, setId] = useState<string>("");
  const { reload } = useContext(ReloadContext);

  useEffect((): void => {
    getCategory().then((data) => setCtgs(data));
  }, [reload]);

  const handleChangeClick = (food: IFood): void => {
    setChangeOpen(true);
    setOldCost(food.cost);
    setId(food._id);
  };

  return (
    <>
      <ChangeFoodModal
        foodId={id}
        oldCost={oldCost}
        changeOpen={changeOpen}
        setChangeOpen={setChangeOpen}
      />

      <AddFoodProductModal prodOpen={prodOpen} setProdOpen={setProdOpen} />

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Food Name</StyledTableCell>
              <StyledTableCell>Food Cost</StyledTableCell>
              <StyledTableCell>Food Category</StyledTableCell>
              <StyledTableCell>Change Cost</StyledTableCell>
              <StyledTableCell>Add Product</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foods &&
              foods.map((food, index) => {
                return (
                  <StyledTableRow key={food._id}>
                    <StyledTableCell component="th" scope="row">
                      {index + 1}
                    </StyledTableCell>
                    <StyledTableCell>{food.name}</StyledTableCell>
                    <StyledTableCell>
                      {accounting.formatNumber(food.cost, 0, " ") + " so'm"}
                    </StyledTableCell>
                    <StyledTableCell>
                      {ctgs.find((c) => c._id === food.category)?.name}
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        variant="outlined"
                        onClick={() => handleChangeClick(food)}
                      >
                        ???????????????? ????????
                      </Button>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Button
                        onClick={() => setProdOpen(true)}
                        variant="outlined"
                      >
                        ???????????????? ??????????????
                      </Button>
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
